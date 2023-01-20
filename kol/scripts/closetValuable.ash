since r15467;
import <zlib.ash>;

void closet_valuable(int value)
{
	batch_open();
	int [item] inventory = get_inventory();
	foreach it in inventory
	{	
		if(!it.tradeable || !it.discardable || it.quest || it.gift)
			continue

		float it_autosell = autosell_price(it)

		if(it_autosell <= 0)
			continue

		float it_value = max(it_autosell, mall_price(it))

		put_closet(item_amount(it), it)
	}
	return
}
batch_close();